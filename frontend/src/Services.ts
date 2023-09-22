import axios from "axios";

export const getBuoysData = async () => {
  return await axios
    .get("https://api.jsonbin.io/v3/b/650df3510574da7622aee6d1", {
      headers: {
        "X-Master-Key": "$2a$10$yYzsZVIzfa61RoCYmVEiruDarKH3egOHgQEvKaZj4X3CYL.JOSZfG",
      },
    })
    .then(({ data }) => data.record);
};
