const TextField = ({ field, value, onChange }) => {
  if (field.type === "checkbox") {
    return (
      <input
        type="checkbox"
        name={field.key}
        checked={value || false}
        onChange={onChange}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
    );
  }

  return (
    <input
      type={field.type}
      name={field.key}
      value={value !== null && value !== undefined ? value : ""}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  );
};

export default TextField;
