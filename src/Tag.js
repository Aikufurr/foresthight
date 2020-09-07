import React, { useState, forwardRef } from 'react';
import './App.css';
import { Link, useLocation, Redirect } from 'react-router-dom'

import { Paper, makeStyles, Box, createMuiTheme, Chip } from '@material-ui/core';

import MaterialTable from "material-table";
import {
  AddBox, ArrowDownward, Check, ChevronLeft, ChevronRight, Clear, DeleteOutline, Edit, FilterList, FirstPage, LastPage,
  Remove, SaveAlt, Search, ViewColumn
} from '@material-ui/icons';

import { Pagination } from '@material-ui/lab';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

export default function Tag({ comic, setComic, page, setPage, getComic }) {
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
    let data = location === "/" || location === "/tag" || location === "/tag/" ? "" : location.rsplit("/", 1)[1]
    return data
  }

  const [tableData, setTableData] = useState([]);

  function getTag() {
    fetch(`http://forestheights.localtest.me/getTag`, {
      method: "POST",
      body: JSON.stringify({
        tag: HeaderView()
      }),
      headers: { "Content-Type": "application/json" },
    }).then(res => res.json())
      .then(body => {
        setTableData(body)
      });
  }

  if (tableData.length === 0) {
    getTag();
  }

  return (
    <React.Fragment>
      <MaterialTable icons={tableIcons} style={{ fontSize: 14 }}
        columns={[
          { title: "Title", field: "TITLE", width: 150 },
          { title: "Description", field: "DESCRIPTION" },
          { title: "Tags", field: "TAGS" },
        ]}
        data={tableData.map(e => {
          return {
            ID: e.ID,
            TITLE: e.TITLE,
            DESCRIPTION: e.DESCRIPTION,
            TAGS: JSON.parse(e.TAGS).sort().join(", ").trim()
          }
        })}
        title={HeaderView()}
        onRowClick={(event, rowData) => {
          // setPage(rowData.tableData.id + 1);
          // getComic(rowData.tableData.id + 1);
          window.location.href = (`/comic/${rowData.tableData.id + 1}`);
        }}
      />
    </React.Fragment>
  );
}