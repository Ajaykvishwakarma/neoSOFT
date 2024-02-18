import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Pagination, Stack, TextField } from "@mui/material";


function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFilter = searchParams.get("searchTerm");
  const [page, setPage] = React.useState(searchParams.get("page") ?? 1);
  const [loading, setLoading] = React.useState(false);
  const [postData, setPostData] = useState(null);
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10;

  const getAllPosts = async () => {
    setLoading(true);
    const { data } = await axios.get(`http://localhost:7000/posts?page=${page}&offset=${pageSize}&searchTerm=${searchFilter ?? ""}`);
    console.log(data)
    setPostData([...data?.data])
    setTotalCount(data?.pages);
    setLoading(false);
  };

  useEffect(() => {
    getAllPosts();
    if (searchFilter && searchFilter !== "") {
      setPage(1);
      setPostData([])
    }
  }, [page, searchFilter])



  const rowsData = postData?.map((item, index) => {

    return {
      id: `${item?._id}`,
      userId: `${item?.userId ?? "-"}`,
      postid: `${item?.id ?? "-"}`,
      title: `${item?.title ?? "-"}`,
      body: `${item?.body ?? "-"}`,
    };
  });

  const columns = [
    {
      field: "postid",
      headerName: "Id",
      minWidth: 100,
      flex: 1,
      renderCell: ({ value }) => (
        <span>{value}</span>
      ),
    },

    {
      field: "userId",
      style: { color: "red" },
      headerName: "User Id",
      minWidth: 150,
      flex: 1,
      renderCell: ({ value }) => (
        <span>{value}</span>
      ),
    },
    {
      field: "title",
      headerName: "Title",
      minWidth: 200,
      flex: 1,
      renderCell: ({ value }) => {
        return (
          <span>{value}</span>
        );
      },
    },
    {
      field: "body",
      headerName: "Body",
      minWidth: 200,
      flex: 1,
      renderCell: ({ value }) => <span>{value}</span>,
    },


  ];


  return (
    <div className="App">

      <Stack
        sx={{
          padding: "10px",
          marginBottom: "50px",
          textAlign: "center"
        }}
      >
        NeoSoft Technologies (Mern stack )
        <span
          style={{
            fontColor: "gray",
            fontSize: "10px"
          }}
        >Ajay Vishwakarma</span>
      </Stack>
      <Stack
        sx={{
          maxWidth: "500px",
          padding: "10px",
          paddingLeft: "10%",
          paddingRight: "10%",
        }}
      >
        <TextField placeholder="Search here.."
          onChange={(e) => {
            searchParams.set("searchTerm", e.target.value);
            setSearchParams(searchParams);
          }}
        />
      </Stack>
      <Stack

        sx={{
          paddingLeft: "10%",
          paddingRight: "10%",
        }}
      >
        <DataGrid
          loading={loading}
          rows={rowsData ?? []}
          columns={columns}
          disableColumnSelector
          disableDensitySelector
          disableRowSelectionOnClick

          slots={{
            pagination: props => (
              <Pagination
                {...props}
                count={Number(totalCount)}
                page={Number(page)}
                rowsPerPage={Number(pageSize)}
                onChange={(_, newPage) => {
                  setPage(newPage);
                  searchParams.set("page", newPage);
                  setSearchParams(searchParams);
                }}
                showFirstButton
                showLastButton
              />
            ),
          }}

        />
      </Stack>
    </div>
  );
}

export default App;
