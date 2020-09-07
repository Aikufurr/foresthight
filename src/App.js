import React, { useState } from 'react';
import './App.css';
import { Link, useLocation, Route } from 'react-router-dom'

import { Paper, Tabs, Tab, ThemeProvider, createMuiTheme } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Pagination } from '@material-ui/lab';
import Comic from './Comic';
import Tag from './Tag';
import Characters from './Characters';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: '980px',
    maxWidth: "980px",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(980 + theme.spacing(2) * 2)]: {
      width: 980,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    backgroundColor: "white",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(980 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const tabs = createMuiTheme({
  overrides: {
    MuiTabs: {
      flexContainer: {
        display: "block"
      }
    },
  }
});

export default function App() {

  String.prototype.rsplit = function (sep, maxsplit) {
    var split = this.split(sep);
    return maxsplit ? [split.slice(0, -maxsplit).join(sep)].concat(split.slice(-maxsplit)) : split;
  }

  function HeaderView() {
    let location = useLocation().pathname;
    let data = parseInt(location.rsplit("/", 1)[1]);
    data = isNaN(data) ? -1 : data;
    return data
  }

  const [comic, setComic] = useState({ comic: null, config: null });
  const [page, setPage] = useState(HeaderView());
  const tabVal = useState(0);
  const classes = useStyles();

  function getComic(page) {
    fetch(`http://forestheights.localtest.me/getComic`, {
      method: "POST",
      body: JSON.stringify({
        id: page
      }),
      headers: { "Content-Type": "application/json" },
    }).then(res => res.json())
      .then(body => {
        setComic(body)
      });
  }

  if (comic.comic === null) {
    getComic(HeaderView())
  }

  const AntTabs = withStyles({
    root: {
      borderBottom: '1px solid #e8e8e8',
    },
    indicator: {
      backgroundColor: '#333',
    },
  })(Tabs);
  return (
    <div className="App">
      <header className="App-header">
        {comic.comic === null ? (<div className="spinner">
          <div className="cube1"></div>
          <div className="cube2"></div>
        </div>) : (
            <React.Fragment>
              <img src={`data:image/png;base64, ${comic.config.logo}`} />
              <main className={classes.layout}>
                <Paper className={classes.paper}>
                  <ThemeProvider theme={tabs}>
                    <AntTabs value={tabVal[0]} onChange={(_, e) => { tabVal[1](e) }} >
                      <Tab label="Comic" to='/comic' component={Link} />
                      <Tab label="Characters" to='/characters' component={Link} />
                      <Tab label="About" to='/about' component={Link} />
                    </AntTabs>
                  </ThemeProvider>
                  <Route path="/" exact component={() =>
                    (<Comic comic={comic} setComic={setComic} page={page} setPage={setPage} />)} />
                  <Route path="/characters" exact component={() =>
                    (<Characters comic={comic} />)} />
                  <Route path="/comic*" component={() =>
                    (<Comic comic={comic} setComic={setComic} page={page} setPage={setPage} />)} />
                  <Route path="/tag*" component={() =>
                    (<Tag comic={comic} setComic={setComic} page={page} setPage={setPage} getComic={getComic} />)} />
                </Paper>
              </main>
            </React.Fragment>
          )}
      </header>
    </div>
  );
}