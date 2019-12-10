import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  state = {
    stars: [],
    loading: false,
    loadingMore: false,
    refreshing: false,
    page: 1,
  };

  async componentDidMount() {
    this.setState({
      loading: true,
    });

    await this.loadStarred();

    this.setState({
      loading: false,
    });
  }

  loadMore = async () => {
    this.setState({
      loadingMore: true,
    });

    await this.loadStarred();

    this.setState({
      loadingMore: false,
    });
  };

  refreshList = async () => {
    await this.setState({
      refreshing: true,
      stars: [],
      page: 1,
    });

    await this.loadStarred();

    this.setState({
      refreshing: false,
    });
  };

  loadStarred = async () => {
    const { page, stars } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({
      stars: [...stars, ...response.data],
      page: page + 1,
    });
  };

  renderFooter = () => {
    const { loadingMore } = this.state;
    return loadingMore ? (
      <ActivityIndicator size="small" color="#7159c1" />
    ) : null;
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;

    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading>
            <ActivityIndicator size="large" color="#7159c1" />
          </Loading>
        ) : (
          <Stars
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            onRefresh={this.refreshList}
            refreshing={refreshing}
            ListFooterComponent={this.renderFooter}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};
