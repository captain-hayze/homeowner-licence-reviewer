import { Link } from 'react-router-dom';
import { Button } from "antd";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-9xl font-medium">404</h1>
      <h3>Page not found</h3>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/">
        <Button type="link">
          Go to Home page
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
