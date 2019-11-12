import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import { Form, SubmitButton, List, InputError, FormField } from './styles';
import Container from '../../components/Container';

class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    hasError: false,
    errorMessage: '',
  };

  // Carregar os dados do localstorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // Salvar os dados do localstorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.repositoris !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true });

    const { newRepo, repositories } = this.state;

    try {
      const response = await api.get(`/repos/${newRepo}`);

      const repositoryExists = repositories.find(
        repo => repo.id === response.id
      );

      if (repositoryExists) {
        throw new Error('Repositório duplicado');
      }

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
        hasError: false,
      });
    } catch (err) {
      this.setState({
        hasError: true,
        errorMessage: err.message,
        loading: false,
        newRepo: '',
      });
    }
  };

  render() {
    const {
      newRepo,
      repositories,
      loading,
      hasError,
      errorMessage,
    } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <FormField hasError={hasError}>
            <input
              type="text"
              placeholder="Adicionar repositório"
              onChange={this.handleInputChange}
              value={newRepo}
            />
            <InputError hasError={hasError}>{errorMessage}</InputError>
          </FormField>

          <SubmitButton loading={loading ? 1 : 0}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>
        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}

export default Main;
