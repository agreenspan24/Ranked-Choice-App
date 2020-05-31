import axios from 'axios';
import { PollDto } from '../types';

export const getPoll = (id: string) => {
    return axios.get<PollDto>('/api/poll', {
        params: {
          id: id
        }
      });
}