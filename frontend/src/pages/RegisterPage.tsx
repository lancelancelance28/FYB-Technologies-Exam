import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/authSchemas";
import { useAuth } from "../context/authContext";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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

interface RegisterFormValues {
  email: string;
  password: string;
}

const RegisterPage = () => {
  const { register: registerUser, error } = useAuth(); 
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const success = await registerUser(data.email, data.password);
    if (success) {
      navigate("/"); 
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgGradient="linear(to-br,rgb(248, 248, 248),rgb(235, 235, 235))"
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
            Create an Account for FYB Tech Code Test
          </Heading>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <FormControl marginTop="10px">
            <FormLabel color="black">Email</FormLabel>
            <Input
              placeholder="Enter your email"
              {...register("email")}
              variant="filled"
              focusBorderColor="blue.400"
              bg="whiteAlpha.800"
              _hover={{ bg: "whiteAlpha.800" }}
              _focus={{ bg: "white" }}
            />
            {errors.email && (
              <Text color="red.500" fontSize="sm">
                {errors.email.message}
              </Text>
            )}
          </FormControl>

          <FormControl margin="10px">
            <FormLabel color="black">Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              variant="filled"
              focusBorderColor="blue.400"
              bg="whiteAlpha.800"
              _hover={{ bg: "whiteAlpha.900" }}
              _focus={{ bg: "white" }}
            />
            {errors.password && (
              <Text color="red.500" fontSize="sm">
                {errors.password.message}
              </Text>
            )}
          </FormControl>

          <Button
            bgColor="blue"
            type="submit"
            colorScheme="blue"
            textColor="white"
            marginTop="10px"
            paddingLeft=" 30px"
            paddingRight=" 30px"
            paddingTop="5px"
            paddingBottom="5px"
            width="full"
            _hover={{
              transform: "scale(1.05)",
              transition: "0.3s",
            }}
          >
            Sign Up
          </Button>

          <Divider borderColor="whiteAlpha.600" />

          <Text color="black" fontSize="sm">
            Already have an account?{" "}
            <Link as={RouterLink} to="/" color="blue.300" fontWeight="bold">
              Log In
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default RegisterPage;
