export const HealthcheckService = {
  isGraphDBAccessible: async (): Promise<{ success: boolean; message: string }> => {
    // const isConnected = await GraphDBService.isConnected();
    const isConnected = false;
    return {
      success: isConnected,
      message: isConnected ? 'Connected' : 'Disconnected',
    };
  },
};
