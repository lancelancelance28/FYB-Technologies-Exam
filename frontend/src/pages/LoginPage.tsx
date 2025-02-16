import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/authSchemas";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  Heading,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Divider,
  Link,
} from "@chakra-ui/react";
import { useAuth } from "../context/authContext"; 

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { login } = useAuth(); 
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgGradient="linear(to-br, rgb(248, 248, 248), rgb(235, 235, 235))"
    >
      <Box
        p={8}
        boxShadow="xl"
        borderRadius="2xl"
        bg="rgb(255, 255, 255)"
        backdropFilter="blur(10px)"
        border="1px solid rgba(255, 255, 255, 0.2)"
        width="400px"
        textAlign="center"
      >
        <VStack as="form" onSubmit={handleSubmit(onSubmit)} spacing={6}>
          <Heading size="lg" color="black" marginTop="10px">
            Welcome to FYB Code Test
          </Heading>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <FormControl marginTop="10px">
            <FormLabel>Email</FormLabel>
            <Input placeholder="Enter your email" {...register("email")} />
            {errors.email && (
              <Text color="red.500" fontSize="sm">
                {errors.email.message}
              </Text>
            )}
          </FormControl>

          <FormControl margin="10px">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password && (
              <Text color="red.500" fontSize="sm">
                {errors.password.message}
              </Text>
            )}
          </FormControl>

          <Button type="submit" bgColor="blue" colorScheme="blue" width="full">
            Login
          </Button>

          <Divider />

          <Text fontSize="sm">
            Don't have an account?{" "}
            <Link
              as={RouterLink}
              to="/register"
              color="blue.300"
              fontWeight="bold"
            >
              Sign up
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default LoginPage;
