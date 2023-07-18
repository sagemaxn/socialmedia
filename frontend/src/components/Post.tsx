import { Button, Flex, Heading, Link, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useRef } from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    useDisclosure,
} from '@chakra-ui/react';

import { useDeletePostMutation } from '../generated/graphql';

const Post = ({ content, user, avatar, createdAt, loggedUser, postID }) => {
    const [deletePost] = useDeletePostMutation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const dateP = new Date(createdAt).toLocaleString();
    const ConfirmDelete = () => {
        return (
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Post
                        </AlertDialogHeader>

                        <AlertDialogBody>Are you sure?</AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={onClose} ref={cancelRef}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                ml={3}
                                onClick={async () => {
                                    try {
                                        await deletePost({
                                            variables: { postID },
                                        });
                                        //alert for success
                                    } catch (err) {
                                        console.log(
                                            'post could not be deleted',
                                        );
                                        console.error(err);
                                        //alert "there was an error deleting this post"
                                    }
                                    onClose();
                                }}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        );
    };
    return (
        <Flex
            bg="white"
            justifyContent="space-between"
            margin="2px"
            w={'100%'}
            //border="solid 1px"
        >
            <Flex>
                <Image
                    alt={avatar}
                    height="80px"
                    objectFit="contain"
                    src={`/${avatar}.png`}
                    style={{
                        padding: '10px',
                    }}
                    width="80px"
                />
                <Flex direction="column">
                    <Heading as="h1" size="sm">
                        <Link href={`/user/${user}/1`}>{user}</Link>
                    </Heading>
                    <Text>{dateP}</Text>
                    <Text>{content}</Text>
                </Flex>
            </Flex>
            {loggedUser === user ? (
                <Button onClick={onOpen} padding="10px" variant="ghost">
                    Delete
                </Button>
            ) : null}
            <ConfirmDelete />
        </Flex>
    );
};

export default Post;
