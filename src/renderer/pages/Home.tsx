import React from 'react';
import { Typography, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('home.title')}
      </Typography>
      <Typography variant="body1">
        {t('home.welcome')}
      </Typography>
    </Container>
  );
};

export default Home; 