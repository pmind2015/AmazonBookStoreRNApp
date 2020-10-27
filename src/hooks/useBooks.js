import { useState, useEffect } from "react";
import axios from "axios";
import { restApiUrl } from "../../Constants";

export default (categoryId, searchText, refreshCategory, setRefresh) => {
  const [books, setBooks] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchBook = searchValue => {
    console.log(searchValue + " түлхүүр үгээр хайлт эхэллээ...");
  };

  useEffect(() => {
    let limit = 30;
    let search = "";

    if (searchText) {
      limit = 50;
      search = `&search=${searchText}`;
    }

    setLoading(true);

    axios
      .get(
        `${restApiUrl}/api/v1/categories/${categoryId}/books?limit=${limit}${search}`
      )
      .then(result => {
        console.log("Номнуудыг амжилттай хүлээж авлаа...");
        setBooks(result.data.data);
        setErrorMessage(null);
        setLoading(false);
        setRefresh(false);
      })
      .catch(err => {
        let message = err.message;
        if (message === "Request failed with status code 404")
          message = "Уучлаарай сэрвэр дээр энэ өгөгдөл байхгүй байна...";
        else if (message === "Network Error")
          message =
            "Сэрвэр ажиллахгүй байна. Та түр хүлээгээд дахин оролдоно уу..";
        setErrorMessage(message);
        setLoading(false);
      });
  }, [categoryId, searchText, refreshCategory]);

  return [books, errorMessage, searchBook, loading];
};
