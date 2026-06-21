import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import SideBar from "./Sidebar";
import {
  deleteOrder,
  getAllOrders,
  clearOrderErrors,
} from "../../actions/orderAction";
import { deleteOrderReset } from "../../redux/slices/orderSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "../../ErrorBoundary";
import { Delete, Edit } from "@mui/icons-material";
const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, orders, isDeleted, deleteError } = useSelector(
    (state) => state.order
  );

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearOrderErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearOrderErrors());
    }

    if (isDeleted) {
      toast.success("Order Deleted Successfully");
      navigate("/admin/orders");
      dispatch(deleteOrderReset());
    }

    dispatch(getAllOrders());
  }, [dispatch, error, deleteError, isDeleted, navigate]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) =>
        params.row.status === "Delivered" ? "greenColor" : "redColor",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.4,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Fragment>
          <Link to={`/admin/order/${params.row.id}`}>
            <Edit />
          </Link>
          <Button onClick={() => deleteOrderHandler(params.row.id)}>
            <Delete />
          </Button>
        </Fragment>
      ),
    },
  ];

  const rows = orders
    ? orders.map((item) => ({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
      }))
    : [];

  return (
    <Fragment>
      <ErrorBoundary>
        <MetaData title={`ALL ORDERS - Admin`} />

        <div className="dashboard">
          <SideBar />
          <div className="productListContainer">
            <h1 id="productListHeading">ALL ORDERS</h1>

            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              className="productListTable"
            />
          </div>
        </div>
      </ErrorBoundary>
    </Fragment>
  );
};

export default OrderList;
