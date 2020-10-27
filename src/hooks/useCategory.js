import { useState, useEffect } from "react";
import axios from "axios";
import { restApiUrl } from "../../Constants";

export default () => {
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchCategory = () => {
    console.log("Хайлт эхэллээ...");
  };
  console.log(`${restApiUrl}/api/v1/categories`);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${restApiUrl}/api/v1/categories`)
      .then(result => {
        console.log("Категорийг амжилттай хүлээж авлаа...");
        setCategories(result.data.data);
        setErrorMessage(null);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        let message = err.message;
        if (message === "Request failed with status code 404")
          message = "Уучлаарай сэрвэр дээр энэ өгөгдөл байхгүй байна...";
        else if (message === "Network Error")
          message =
            "Сэрвэр ажиллахгүй байна. Та түр хүлээгээд дахин оролдоно уу...";
        setErrorMessage(message);
      });
  }, []);

  return [categories, errorMessage, loading];
};
