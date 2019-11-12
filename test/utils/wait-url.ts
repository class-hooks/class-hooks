import axios from 'axios';

export const waitUrl = async (url: string): Promise<void> => {
  while (true) {
    try {
      await axios.get(url);
      return;
    } catch (err) {
      // do nothing, try again
    }
  }
};
