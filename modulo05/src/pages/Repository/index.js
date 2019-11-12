import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Loading,
  Owner,
  IssueList,
  IssueFilter,
  Pagination,
  PreviousButton,
  NextButton,
} from './styles';
import Container from '../../components/Container';

class Repository extends Component {
  state = {
    repository: {},
    issues: [],
    loading: true,
    filter: 'open',
    page: 1,
  };

  async componentDidMount() {
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);

    const { page } = this.state;

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          page,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  handleIssueFilter = async e => {
    e.preventDefault();
    this.setState({ loading: true });

    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);
    const filter = e.target.value;

    const issues = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: filter,
        page: 1,
      },
    });

    this.setState({
      issues: issues.data,
      loading: false,
      filter,
      page: 1,
    });
  };

  handleNextPage = async e => {
    e.preventDefault();
    this.setState({ loading: true });

    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);
    const { page, filter } = this.state;

    const nextPage = page + 1;

    const issues = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: filter,
        page: nextPage,
      },
    });

    this.setState({
      issues: issues.data,
      loading: false,
      page: nextPage,
    });
  };

  handlePreviousPage = async e => {
    e.preventDefault();
    this.setState({ loading: true });

    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);
    const { page, filter } = this.state;

    const previousPage = page - 1;

    const issues = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: filter,
        page: previousPage,
      },
    });

    this.setState({
      issues: issues.data,
      loading: false,
      page: previousPage,
    });
  };

  render() {
    const { repository, issues, loading, filter, page } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueList>
          <IssueFilter onChange={this.handleIssueFilter} value={filter}>
            <option value="all">Todos</option>
            <option value="open">Abertas</option>
            <option value="closed">Fechadas</option>
          </IssueFilter>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <Pagination>
          <PreviousButton
            firstPage={page === 1}
            onClick={this.handlePreviousPage}
          >
            Anterior
          </PreviousButton>
          <NextButton onClick={this.handleNextPage}>Próximo</NextButton>
        </Pagination>
      </Container>
    );
  }
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
};

export default Repository;
