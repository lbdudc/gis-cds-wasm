const repositories = {};

const repositoryFiles = require.context(".", true, /\.js$/);

//Dynamic import of Repositories
// NOTE: For this algorithm work properly,
// all files in 'repositories' folder must have different names

repositoryFiles.keys().forEach((filename) => {
  Object.keys(repositoryFiles(filename)).forEach((key) => {
    //Format key from './Filename.js' to 'Filename'
    let nameParts = filename.split("/");
    let relativeName = nameParts[nameParts.length - 1];
    let repoKey = relativeName.replace(".js", "");
    repositories[repoKey] = repositoryFiles(filename)[key];
  });
});

export default {
  get: (name) => repositories[name],
};
