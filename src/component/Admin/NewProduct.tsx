import React, { Fragment, useState } from "react";
import "./newProduct.css";
import { useCreateProduct } from "../../hooks/useAdminProducts";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import {
  AccountTree,
  Description,
  Storage,
  Spellcheck,
  AttachMoney,
} from "@mui/icons-material";
import SideBar from "./Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Resizer from "react-image-file-resizer";
import Loader from "../layout/Loader/Loader";

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const NewProduct: React.FC = () => {
  const navigate = useNavigate();
  const createProductMutation = useCreateProduct();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [Stock, setStock] = useState<number | string>("");
  const [images, setImages] = useState<string[]>([]);
  const [imagesPreview, setImagesPreview] = useState<any[]>([]);

  const createProductSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", String(price));
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("Stock", String(Stock));

    images.forEach((image) => {
      myForm.append("images", image);
    });

    createProductMutation.mutate(myForm, {
      onSuccess: () => {
        toast.success("Product Created Successfully");
        navigate("/admin/dashboard");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message ?? "Product creation failed");
      },
    });
  };

  const createProductImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);

          Resizer.imageFileResizer(
            file,
            500,
            500,
            "JPEG",
            90,
            0,
            (uri) => {
              setImages((old) => [...old, uri as string]);
            },
            "base64",
          );
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title="Create Product" />
      {createProductMutation.isPending ? (
        <Loader />
      ) : (
        <div className="dashboard">
          <SideBar />
          <div className="newProductContainer">
            <form
              className="createProductForm"
              encType="multipart/form-data"
              onSubmit={createProductSubmitHandler}
            >
              <h1>Create Product</h1>
              <div>
                <Spellcheck />
                <input
                  type="text"
                  placeholder="Product Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <AttachMoney />
                <input
                  type="number"
                  placeholder="Price"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
              <div>
                <Description />
                <textarea
                  placeholder="Product Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  cols={30}
                  rows={1}
                ></textarea>
              </div>
              <div>
                <AccountTree />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Choose Category</option>
                  {categories.map((cate) => (
                    <option key={cate} value={cate}>
                      {cate}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Storage />
                <input
                  type="number"
                  placeholder="Stock"
                  required
                  value={Stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                />
              </div>
              <div id="createProductFormFile">
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={createProductImagesChange}
                  multiple
                />
              </div>

              <div id="createProductFormImage">
                {imagesPreview.map((image, index) => (
                  <img key={index} src={image} alt="Product Preview" />
                ))}
              </div>
              <Button
                id="createProductBtn"
                type="submit"
                disabled={createProductMutation.isPending}
              >
                Create
              </Button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default NewProduct;
