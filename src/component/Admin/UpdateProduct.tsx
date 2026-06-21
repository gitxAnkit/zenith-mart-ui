import React, { Fragment, useEffect, useState } from 'react';
import { useProductDetails } from '../../hooks/useProductDetails';
import { useUpdateProduct } from '../../hooks/useAdminProducts';
import { Button } from '@mui/material';
import MetaData from '../layout/MetaData';
import SideBar from './Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  AccountTree,
  AttachMoney,
  Description,
  Spellcheck,
  Storage,
} from '@mui/icons-material';
import Resizer from 'react-image-file-resizer';
import ErrorBoundary from '../../ErrorBoundary';
import Loader from '../layout/Loader/Loader';

const categories = [
  'Laptop',
  'Footwear',
  'Bottom',
  'Tops',
  'Attire',
  'Camera',
  'SmartPhones',
];

const UpdateProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams<{ id: string }>();

  const { data: productDetailsResult, isLoading: loadingDetails, error: detailsError } = useProductDetails(productId);
  const product = productDetailsResult?.product;
  const updateProductMutation = useUpdateProduct();

  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [Stock, setStock] = useState<number | string>('');
  const [images, setImages] = useState<string[]>([]);
  const [oldImages, setOldImages] = useState<any[]>([]);
  const [imagesPreview, setImagesPreview] = useState<any[]>([]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setStock(product.Stock);
      setOldImages(product.images || []);
    }
  }, [product]);

  useEffect(() => {
    if (detailsError) {
      const err = detailsError as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Failed to load product details');
    }
  }, [detailsError]);

  const updateProductSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) return;

    const myForm = new FormData();
    myForm.set('name', name);
    myForm.set('price', String(price));
    myForm.set('description', description);
    myForm.set('category', category);
    myForm.set('Stock', String(Stock));

    images.forEach((image) => {
      myForm.append('images', image);
    });

    updateProductMutation.mutate(
      { id: productId, productData: myForm },
      {
        onSuccess: () => {
          toast.success('Product Updated Successfully');
          navigate('/admin/products');
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message ?? 'Product update failed');
        },
      }
    );
  };

  const updateProductImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            'JPEG',
            70,
            0,
            (uri) => {
              setImages((old) => [...old, uri as string]);
            },
            'base64'
          );
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const isLoading = loadingDetails || updateProductMutation.isPending;

  return (
    <Fragment>
      <ErrorBoundary>
        <MetaData title="Update Product" />
        {isLoading ? (
          <Loader />
        ) : (
          <div className="dashboard">
            <SideBar />
            <div className="newProductContainer">
              <form
                className="createProductForm"
                encType="multipart/form-data"
                onSubmit={updateProductSubmitHandler}
              >
                <h1>Update Product</h1>

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
                    onChange={(e) => setPrice(Number(e.target.value))}
                    value={price}
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
                    onChange={(e) => setStock(Number(e.target.value))}
                    value={Stock}
                  />
                </div>

                <div id="createProductFormFile">
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={updateProductImagesChange}
                    multiple
                  />
                </div>

                <div id="createProductFormImage">
                  {oldImages &&
                    oldImages.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt="Old Product Preview"
                      />
                    ))}
                </div>

                <div id="createProductFormImage">
                  {imagesPreview.map((image, index) => (
                    <img key={index} src={image} alt="Product Preview" />
                  ))}
                </div>

                <Button
                  id="createProductBtn"
                  type="submit"
                  disabled={updateProductMutation.isPending}
                >
                  Update
                </Button>
              </form>
            </div>
          </div>
        )}
      </ErrorBoundary>
    </Fragment>
  );
};

export default UpdateProduct;
