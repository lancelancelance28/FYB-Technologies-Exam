import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  useToast,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

interface Product {
  id?: string;
  name: string;
  price: number;
  description: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const toast = useToast();

  const fetchProducts = async () => {
    try {
      const response = await axios.get<{
        products: Product[];
        totalPages: number;
      }>(`http://localhost:8000/products?page=${page}&limit=8`);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleSave = async () => {
    try {
      if (currentProduct?.id) {
        await axios.put(
          `http://localhost:8000/products/${currentProduct.id}`,
          currentProduct,
        );

        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === currentProduct.id ? currentProduct : product,
          ),
        );

        toast({
          title: "Product updated",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        const response = await axios.post(
          "http://localhost:8000/products",
          currentProduct,
        );

        setProducts((prevProducts) => [...prevProducts, response.data]);

        toast({
          title: "Product added",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
      fetchProducts();
      onClose();
    } catch (error) {
      console.error("Failed to save product:", error);
      toast({
        title: "Failed to save product",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleDeleteConfirm = (id: string) => {
    setDeleteId(id);
    onDeleteOpen();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`http://localhost:8000/products/${deleteId}`);
      setProducts(products.filter((product) => product.id !== deleteId));
      toast({
        title: "Product deleted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast({
        title: "Failed to delete product",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setDeleteId(null);
      onDeleteClose();
    }
  };

  if (!user) return <Navigate to="/" replace />;

  return (
    <Box p={6}>
      <Flex justify="space-between" mb={4}>
        {" "}
        <Text fontSize="2xl" fontWeight="bold">
          Products Management
        </Text>{" "}
        <Button onClick={logout}>Logout</Button>
      </Flex>
      <Flex justify="flex-end" mb={4}>
        <Button
          colorScheme="blue"
          onClick={() => {
            setCurrentProduct({ name: "", price: 0, description: "" });
            onOpen();
          }}
        >
          + Add Product
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Flex margin="24px">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Price</Th>
                <Th>Description</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product) => (
                <Tr key={product.id}>
                  <Td>{product.id}</Td>
                  <Td>{product.name}</Td>
                  <Td>${product.price}</Td>
                  <Td>{product.description}</Td>
                  <Td>
                    <Button
                      size="sm"
                      mr={2}
                      colorScheme="yellow"
                      onClick={() => {
                        setCurrentProduct(product);
                        onOpen();
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteConfirm(product.id!)} 
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Flex>
      )}

      {/* Pagination */}
      <Flex mt={4} justify="space-between">
        <Button isDisabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <Text>
          Page {page} of {totalPages}
        </Text>
        <Button
          isDisabled={page >= totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </Flex>

      {/* Add/Edit Product Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentProduct?.id ? "Edit Product" : "Add Product"}
          </ModalHeader>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input
                value={currentProduct?.name || ""}
                onChange={(e) =>
                  setCurrentProduct((prev) => ({
                    ...prev!,
                    name: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                value={currentProduct?.price || ""}
                onChange={(e) =>
                  setCurrentProduct((prev) => ({
                    ...prev!,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Input
                value={currentProduct?.description || ""}
                onChange={(e) =>
                  setCurrentProduct((prev) => ({
                    ...prev!,
                    description: e.target.value,
                  }))
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              {currentProduct?.id ? "Update" : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>Are you sure you want to delete this product?</ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;
