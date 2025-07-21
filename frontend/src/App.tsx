import { Send } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card, CardContent } from './components/ui/card'
import { ScrollArea } from './components/ui/scroll-area'
import { Textarea } from './components/ui/textarea'
import React, { useState } from 'react'
import { LoremIpsum } from 'lorem-ipsum'
import { Input } from './components/ui/input'
import ReactMarkdown from "react-markdown"

const lorem = new LoremIpsum()
const dummyText = lorem.generateParagraphs(4)

function App() {
  const [response, setResponse] = useState(dummyText);
  const [query, setQuery] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [hasPassword, setHasPassword] = useState<boolean>(false);

  const handleClick = async () => {
    if (!query.trim()) {
      setQuery("");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "x-api-key": password
        },
        body: JSON.stringify({ query })
      })
  
      if (res.status === 401) {
        setResponse("You entered an incorrect password. Refresh the page and try again.");
        setQuery("");
        return;
      }

      if (res.status === 429) {
        setResponse("You have exceeded your limit, please try again in a minute.");
        setQuery("");
        return;
      }

      const data = await res.json()
      setResponse(data.response);
    } catch (err) {
      console.error("API error:", err);
      setResponse("Something went wrong, please try again")
    }
    setQuery("");
  }

  const handleQueryKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleClick()
    }
  }

  const handlePasswordKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      setHasPassword(true);
    }
  }

  if (!hasPassword) {
    return (
      <div className='flex h-screen items-center w-1/3 mx-auto'>
        <Input 
          placeholder='Enter the password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handlePasswordKeydown}
        />
      </div>
    )
  }

  return (
    <div className='flex flex-col h-screen'>
      <div className='px-3 py-2'>
        <p className='md:text-sm text-muted-foreground italic'>Revenge of the 5th</p>
      </div>
      <div className='h-full flex flex-col justify-center w-1/3 mx-auto gap-10'>
        <Card className='py-0 px-6'>
          <CardContent className='relative  whitespace-pre-wrap px-1'>
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-white dark:from-background to-transparent z-10" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-white dark:from-background to-transparent z-10" />

            <ScrollArea className='max-h-64 overflow-y-auto py-3'>
              <ReactMarkdown>
                {response}
              </ReactMarkdown>
            </ScrollArea>
          </CardContent>
        </Card>
        <div className='flex gap-3 items-center border-input border rounded-md px-3 py-2 shadow-xs'>
          <Textarea
            placeholder='What do you want to know?'
            className='focus-visible:border-0 focus-visible:ring-0 border-0 px-0 py-0 shadow-none resize-none'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleQueryKeydown}
          ></Textarea>
          <Button 
            variant={"outline"} 
            size={"icon"}
            onClick={handleClick}>
              <Send/>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App
