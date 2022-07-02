import { Box, Button, ChakraProvider, Heading, Stack } from '@chakra-ui/react';
import React from 'react';
import { createRoot } from 'react-dom/client';

const Popup = () => {
  return (
    <div>
      <Box width="xs" borderRadius="lg" p={6}>
        <Stack direction="column" spacing={6} align="center">
          <Heading as="h1" fontSize="2xl" textAlign="center">
            Click on the button to scrape Medium Article
          </Heading>
          <Button
            variant="solid"
            colorScheme="blue"
            onClick={() => {
              chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                // chrome.tabs.sendMessage(tabs[0].id, { type: 'popup' });
                chrome.runtime.sendMessage({ type: 'color', tabId: tabs[0].id });
              });
            }}
          >
            Scrape Article
          </Button>
        </Stack>
      </Box>
    </div>
  );
};

const root = createRoot(document.getElementById('app'));

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <Popup />
    </ChakraProvider>
  </React.StrictMode>
);
