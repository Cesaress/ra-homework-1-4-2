import React, { useState } from "react";
import PropTypes from "prop-types";
import ValidateMessage from "./ValidateMessage.js";

export default function TrainingAddForm(props) {
  const { valueForm } = props;
  const [form, setForm] = useState(valueForm);

  const [validateErr, setValidateErr] = useState({
    date: false,
    distance: false,
  });

  if (valueForm.id) {
    form.id = valueForm.id;
    form.date = valueForm.date;
    form.distance = valueForm.distance;
    valueForm.id = null;
  }

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setValidateErr((prevValidateErr) => ({
      ...prevValidateErr,
      [name]: false,
    }));
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const checkValue = (evt) => {
    const { name, value } = evt.target;
    let regexpDate;

    if (name === "date") {
      regexpDate = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.\d\d$/;
    } else if (name === "distance") {
      regexpDate = /^\d+([.]\d+)?(км)?$/g;
    }

    if (!value.match(regexpDate)) {
      setValidateErr((prevValidateErr) => ({
        ...prevValidateErr,
        [name]: true,
      }));
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (form.date && form.distance) {
      if (!validateErr.date && !validateErr.distance) {
        const numberDistance = parseFloat(form.distance);
        const strKilometr = form.distance.replace(numberDistance, "");

        props.onFormSubmit({
          id: form.id,
          date: form.date,
          distance: numberDistance,
          kilometr: strKilometr,
        });

        setForm({
          id: "",
          date: "",
          distance: "",
        });
      }
    }
  };

  return (
    <form className="form-add">
      <label>
        Дата (ДД.ММ.ГГ)
        <input
          name="date"
          value={form.date}
          onChange={handleChange}
          onBlur={checkValue}
        />
        {validateErr.date && <ValidateMessage msg={"Не верно введена дата!"} />}
      </label>
      <label>
        Пройдено км
        <input
          name="distance"
          value={form.distance}
          onChange={handleChange}
          onBlur={checkValue}
        />
        {validateErr.distance && (
          <ValidateMessage msg={"Не верно введена дистанция!"} />
        )}
      </label>
      <input type="button" value="OK" onClick={handleSubmit} />
    </form>
  );
}

TrainingAddForm.propTypes = {
  valueForm: PropTypes.object.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
};