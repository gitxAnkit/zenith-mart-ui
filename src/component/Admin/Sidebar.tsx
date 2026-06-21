import React from "react";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import logo from "../../images/logo2.png";
import {
  Add,
  Dashboard,
  ExpandMore,
  ImportExport,
  ListAlt,
  People,
  PostAddSharp,
  RateReview,
} from "@mui/icons-material";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/">
        <img src={logo} alt="Ecommerce" />
      </Link>
      <Link to="/admin/dashboard">
        <p>
          <Dashboard /> Dashboard
        </p>
      </Link>
      <Link>
        <SimpleTreeView
          collapseicon={<ExpandMore />}
          expandicon={<ImportExport />}
        >
          <TreeItem nodeid="1" label="Products" itemId="products">
            <Link to="/admin/products">
              <TreeItem
                noded="2"
                label={
                  <span>
                    <PostAddSharp /> All
                  </span>
                }
                itemId="products-all"
              />
            </Link>

            <Link to="/admin/product">
              <TreeItem
                nodeid="3"
                label={
                  <span>
                    <Add /> Create
                  </span>
                }
                itemId="products-create"
              />
            </Link>
          </TreeItem>
        </SimpleTreeView>
      </Link>
      <Link to="/admin/orders">
        <p>
          <ListAlt />
          Orders
        </p>
      </Link>
      <Link to="/admin/users">
        <p>
          <People /> Users
        </p>
      </Link>
      <Link to="/admin/reviews">
        <p>
          <RateReview /> Reviews
        </p>
      </Link>
    </div>
  );
};

export default Sidebar;
