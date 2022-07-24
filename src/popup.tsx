import { Box, Button, ChakraProvider, Flex, Heading, Stack } from '@chakra-ui/react';
import React from 'react';
import { createRoot } from 'react-dom/client';

const Popup = () => {
  return (
    <>
      <Box w="xs">
        <Stack direction="column" spacing={0} align="center">
          <Box w="100%" bg="blue.200" p={4}>
            <Heading as="h1" fontSize="2xl" textAlign="center">
              Medium2Markdown
            </Heading>
          </Box>
          <Box w="100%" bg="facebook.600" p={4}>
            <Flex justify="center">
              <Button
                onClick={() => {
                  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.runtime.sendMessage({ type: 'scrape', tabId: tabs[0].id });
                  });
                }}
              >
                Scrape this article
              </Button>
            </Flex>
          </Box>
        </Stack>
      </Box>
    </>
  );
};

const root = createRoot(document.getElementById('app')!);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <Popup />
    </ChakraProvider>
  </React.StrictMode>
);
