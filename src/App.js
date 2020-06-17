import React, { useState, useEffect } from 'react';
import { View, Panel, PanelHeader, Header, Group, Cell, CellButton, PanelHeaderButton, Avatar, SimpleCell } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

const Friend = props => {
  return (
    <Group>
      <SimpleCell
        before={<Avatar src={props.friend.photo_200_orig} />}
      >
        {props.friend.first_name} {props.friend.last_name}
      </SimpleCell>
    </Group>
  );
};

const App = () => {
  const [personInfo, setPersonInfo] = useState({});
  const [activePanel, setActivePanel] = useState('profile');
  const [friendsInfo, setFriendsInfo] = useState([]);

  async function fetchPerson() {
    const res = await fetch('https://cors-anywhere.herokuapp.com/https://api.vk.com/method/users.get?user_id=15&v=5.110&access_token=d104ab9dd104ab9dd104ab9daad1760a94dd104d104ab9d8fecf68c9f1849465966591d&fields=bdate,city,country,photo_max_orig');
    res.json()
       .then(data => setPersonInfo(data.response[0]))
       .catch(err => console.log('Cannot get person info: ', err));
  };

  useEffect(() => {
    fetchPerson();
  });

  async function fetchFriends() {
    const res = await fetch('https://cors-anywhere.herokuapp.com/https://api.vk.com/method/friends.get?user_id=15&v=5.110api.vk.com/method/friends.get?user_id=1&v=5.110&order=hints&access_token=d104ab9dd104ab9dd104ab9daad1760a94dd104d104ab9d8fecf68c9f1849465966591d&count=20&fields=photo_200_orig');
    res.json()
        .then(data => setFriendsInfo(data.response.items))
        .catch(err => console.log('Cannot get friends list: ', err));
  }

  function friendsList() {
    return friendsInfo.map(currentFriend => {
      return <Friend friend = {currentFriend}
                     key={ currentFriend.id }/>
    })
  }

  function openFriends() {
    setActivePanel('friends');
    fetchFriends();
  };

  return (
    <View activePanel={activePanel}>
      <Panel id="profile">
        <PanelHeader>Стартовый экран</PanelHeader>
        <Group header={<Header mode="secondary">Информация</Header>}>
          <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <Avatar style={{margin: '0 auto'}} size={200} src={personInfo.photo_max_orig} />
          </div>
          <Cell>Имя: {personInfo.first_name}</Cell>
          <Cell>Фамилия: {personInfo.last_name}</Cell>
          <Cell>Дата рождения: {personInfo.bdate}</Cell>
        </Group>
        <Group>
          <CellButton
            onClick={() => openFriends()}
          >
            Список Друзей
          </CellButton>
        </Group>
      </Panel>
      <Panel id="friends">
        <PanelHeader
          addon={<PanelHeaderButton onClick={() => setActivePanel('profile')}> Назад </PanelHeaderButton>}
        >
          Друзья
        </PanelHeader>
        <div className="friends-list">
          { friendsList() }
        </div>
      </Panel>
    </View>
  );
};

export default App;