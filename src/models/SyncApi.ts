import axios, { AxiosPromise } from 'axios';

interface HasId {
  id?: number;
}

export class SyncApi<T extends HasId> {
  constructor(public rootUrl: string) {}

  fetch(id: number): AxiosPromise {
    return axios.get(`${this.rootUrl}/${id}`);
  }

  save(data: T): AxiosPromise {
    const { id } = data;

    return id
      ? axios.put(`${this.rootUrl}/${id}`, data)
      : axios.post(this.rootUrl, data);
  }
}
