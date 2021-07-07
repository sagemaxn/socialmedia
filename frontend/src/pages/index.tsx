import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
  Button
} from '@chakra-ui/react'
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons'

import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { CTA } from '../components/CTA'
import { Footer } from '../components/Footer'

import {useQuery, gql,} from '@apollo/client'
import { GetServerSideProps } from 'next'
import {client} from './_app'


export const getServerSideProps: GetServerSideProps = async() => {
  const TEST = {query: gql`
  query{
    bye
  }`}
  const { data, loading } = await client.query(TEST)
  const test = "test!"
  console.log(data)
  return {props: {data, loading, test}}
  
}

const Index = ({data, loading}) => {
  const QUERY = gql`
  query{
    bye
  }
  `
  if(data.loading){
    console.log('loading')
    return <div>...loading</div>
  }
  return(
  <Container height="100vh">   
    <Button onClick={(()=> console.log(loading))}></Button>
    <Button onClick={(() => console.log(data))}></Button>
  </Container>
)
}


export default Index
