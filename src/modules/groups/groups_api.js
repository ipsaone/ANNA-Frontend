import axios from 'axios';
import base from '@/api/url';

const url = base + '/groups/'

export default {
    getAllGroups() {
      return axios.get(url, {withCredentials: true});
  },
    deleteGroup(id) {
      return axios.delete(url + id, {withCredentials: true});
  },
    addGroup(group){
      return axios.post(url + id, group, {withCredentials: true});
    }
}
