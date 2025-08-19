const ComputedField = ({ value, label }) => (
  <div className="w-full border border-gray-200 bg-gray-100 rounded-md px-3 py-2 text-gray-700">
    {value ?? 0}
  </div>
);

export default ComputedField;
