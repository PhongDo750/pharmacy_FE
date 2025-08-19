const ConfirmBox = ({title, onCancel, onSubmit}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(onSubmit)
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-20 bg-black/30 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl transform transition-all duration-300 animate-slideDown"
      >
        <h2 className="text-lg font-bold mb-4">{title}</h2>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Xác nhận
          </button>
        </div>
      </form>
    </div>
    );
}

export default ConfirmBox;