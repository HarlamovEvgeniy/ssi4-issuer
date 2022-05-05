import axios from "axios";

class BackendVerifierService {
  instance;

  constructor() {
    // Set config defaults when creating the instance
    this.instance = axios.create({
      baseURL: "https://ssi2.cryptan.site/",
    });
  }

  issueVc(token) {
    return this.instance.post(
      "/auth/issue-vc",
      {},
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
  }
}

const backendVerifierService = new BackendVerifierService();

export default backendVerifierService;
