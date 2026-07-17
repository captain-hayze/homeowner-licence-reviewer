import { Form, Input, Button, message } from "antd";
import useSWRMutation from "swr/mutation";
import { useNavigate } from "react-router-dom";
import { handleMutation } from "../../utils/axios";
import { useAppStore } from "../../hooks/useAppStore";

type LoginPayload = {
  email: string;
  password: string;
}

export default function Login() {
  const [form] = Form.useForm();
  const { setUser, setToken, setIsAuthenticated } = useAppStore((state) => state);
  const navigate = useNavigate();

  const { trigger, isMutating } = useSWRMutation(
    "license-user/login",
    handleMutation
  );

  const handleFinish = async (values: LoginPayload) => {
	  if (!values) return;

	  try {
	    const res = await trigger(values);

      setUser(res.data);
      setToken(res.token);
      setIsAuthenticated(true);

      navigate("/dashboard"); // Redirect to dashboard after successful login
	  
	    if (res) {
		    message.success("Login completed successfully");
	    }
	  } catch (error) {
	    console.error(error);
	    message.error("Failed to complete login. Please try again.");
	  }
  }

  return (
    <div className="p-6 max-w-md w-full mx-auto">
      <h2 className="text-2xl text-gray-950 font-semibold mb-4">Sign in</h2>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input placeholder="you@example.com" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isMutating}
            disabled={isMutating}
          >
            Continue
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
