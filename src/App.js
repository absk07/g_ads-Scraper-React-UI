import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Grid from '@mui/material/Grid';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

function App() {
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = () => {
    setLoading(true);
    setErr(null);
    fetch('http://127.0.0.1:5000/get-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ search_txt: searchText })
    }).then(response => response.json()).then(data => {
      if (data.success) {
        setSearchResults(data.data);
        const value = new SpeechSynthesisUtterance(`The price of ${data.data.title} is ${data.data.price}`);
        window.speechSynthesis.speak(value);
      } else {
        setSearchResults(null);
        setErr(data.message)
        console.error(data.message);
      }
    }
    ).catch(e => {
      console.error('API request error:', e);
      setErr('Something went wrong!');
    }).finally(() => {
      setLoading(false);
      setSearchText('');
    });
  };
  const speak = () => {
    const value = new SpeechSynthesisUtterance(`The price of ${searchResults.title} is ${searchResults.price}`);
    window.speechSynthesis.speak(value);
  }

  return (
    <React.Fragment>
      {loading && <Loader />}
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Product Search
          </Typography>
        </Box>
        <Box
          sx={{
            '& > :not(style)': { m: 1, width: '100%' },
          }}
        >
          {err && <ErrorMessage variant="error" message={err} setErr={setErr} />}
          <TextField id="outlined-basic" label="Write the product name" variant="outlined" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
          <Button variant="contained" size="large" onClick={handleSearch}>Search</Button>
          {
            searchResults && (
              <Grid container spacing={2} columns={16}>
                <Grid item xs={8}>
                  <img src={searchResults?.image} alt="Product Thumbnail" />
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="subtitle1" gutterBottom>
                    The price of {searchResults?.title} is {searchResults?.price}.
                  </Typography>
                  <VolumeUpIcon onClick={speak} style={{ cursor: "pointer" }} />
                </Grid>
              </Grid>
            )
          }
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default App;
