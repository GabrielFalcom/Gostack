const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const middleRepoDoesNotExist = (request, response, next) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repoistory does not exists.' })
  }

  return next()
}

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)
  
  return response.json(repository)
});

app.put("/repositories/:id", middleRepoDoesNotExist, (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  const updateRepo = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = updateRepo

  return response.json(updateRepo)

});

app.delete("/repositories/:id", middleRepoDoesNotExist, (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", middleRepoDoesNotExist, (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  repositories[repositoryIndex].likes++

  return response.json(repositories[repositoryIndex])
  
});

module.exports = app;
