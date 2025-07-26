import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 border w-full min-h-screen flex justify-center items-center">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold">Hospital Management System</h1>
          <p className="mt-4 text-lg md:text-xl">Solving problems using tech</p>
          <div className="mt-8">
            <Link to="/todo" className="ml-4 bg-transparent border border-white px-6 py-3 rounded-md text-white hover:bg-white hover:text-indigo-600">
              Todo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage