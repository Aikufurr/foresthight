import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Chip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '45ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

export default function Characters() {
  const classes = useStyles();

  const [characters, setCharacters] = useState([]);

  function getCharacters() {
    fetch(`http://forestheights.localtest.me/getCharacters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).then(res => res.json())
      .then(body => {
        setCharacters(body)
      });
  }

  if (characters.length === 0) {
    getCharacters();
  }

  return (
    <List className={classes.root}>

      {characters.map((char, index) => {
        return (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <img src={`data:image/png;base64, ${char.IMAGE}`} width={150} style={{ paddingRight: 20 }} />
              </ListItemAvatar>
              <ListItemText
                primary={char.NAME}
                secondary={
                  <React.Fragment>
                    <Chip size="small" label={char.SPECIES} />
                    {char.BREED !== null ? (
                      <Chip size="small" label={char.BREED} />) : (<React.Fragment />)}
                    <br />
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {char.DESCRIPTION}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>

            <Divider variant="inset" component="li" />
          </React.Fragment>)
      })}

    </List>
  );
}
