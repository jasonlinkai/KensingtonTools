import React from 'react';
import { Typography, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('about.title')}
      </Typography>
      <Typography variant="body1">
        {t('about.description')}
      </Typography>
    </Container>
  );
};

export default About; 