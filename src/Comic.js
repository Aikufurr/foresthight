import React, { useState } from 'react';
import './App.css';
import { Link, useLocation } from 'react-router-dom'

import { Paper, makeStyles, Box, createMuiTheme, Chip, Typography, Card, CardContent } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

function Comic({ comic, setComic, page, setPage }) {
  const chipStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      listStyle: 'none',
      padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  }))();

  String.prototype.rsplit = function (sep, maxsplit) {
    var split = this.split(sep);
    return maxsplit ? [split.slice(0, -maxsplit).join(sep)].concat(split.slice(-maxsplit)) : split;
  }

  function HeaderView() {
    let location = useLocation().pathname;
    let data = {}
    console.log(location === "/", location === "/comic", location === "/comic/",  parseInt(location.rsplit("/", 1)[1]))
    data["comicID"] = location === "/" || location === "/comic" || location === "/comic/" ? -1 : parseInt(location.rsplit("/", 1)[1])

    return data
  }

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

  return (
    <React.Fragment>
      <br />
      <React.Fragment>
        <img src={`data:image/png;base64, ${comic.comic.IMAGE}`} />
        <Card style={{ textAlign: "left", width: 500, marginBottom: 5 }}>
          <CardContent>
            <Typography style={{ fontSize: 24 }} gutterBottom>
              <strong>{comic.comic.TITLE}</strong>
            </Typography>
            <Typography style={{ fontSize: 14 }} gutterBottom>
              {comic.comic.DESCRIPTION}
            </Typography>
            <hr style={{ opacity: 0.2 }} />
            <span style={{ alignSelf: "center", fontSize: "20px" }}>Tags</span>
            <Paper elevation={0} component="ul" className={chipStyles.root}>
              {JSON.parse(comic.comic.TAGS).sort().map((value, key) => {
                return (
                  <li key={key}>
                    <Link to={`/tag/${value}`}>
                      <Chip className="chip" size="small" label={value} />
                    </Link>
                  </li>
                );
              })}
            </Paper>
          </CardContent>
        </Card>
      </React.Fragment>
      <React.Fragment>
        <Box
          display="flex"
          width={"100%"}
        >
          <Box m="auto">
            <Pagination count={comic.config.count} page={page === -1 ? comic.config.count : page} onChange={(_, e) => {
              setPage(e);
              getComic(e);
              window.history.pushState({}, "", `/comic/${e}`)
            }} showFirstButton showLastButton />
          </Box>
        </Box>
      </React.Fragment>
    </React.Fragment>
  );
}

export default Comic;
