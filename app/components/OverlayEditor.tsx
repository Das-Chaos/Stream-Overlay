'use client'

import { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Plus, Eye, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import OverlayItem from './OverlayItem'
import OverlayGrid from './OverlayGrid'
import PreviewMode from './PreviewMode'
import { FileUpload } from './FileUpload'
import { io } from 'socket.io-client'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

const socket = io()

export default function OverlayEditor() {
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.name) {
      socket.emit('joinOverlay', session.user.name)
    }

    fetchItems()

    socket.on('overlayUpdate', (updatedItems) => {
      setItems(updatedItems)
    })

    return () => {
      socket.off('overlayUpdate')
    }
  }, [session])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/overlay-items')
      if (response.ok) {
        const data = await response.json()
        setItems(data.items)
      } else {
        throw new Error('Failed to fetch overlay items')
      }
    } catch (error) {
      console.error('Error fetching overlay items:', error)
    }
  }

  const addItem = async (type) => {
    try {
      const response = await fetch('/api/overlay-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, content: type === 'text' ? 'New Text' : '', position: { x: 0, y: 0 } }),
      })
      if (response.ok) {
        const { items } = await response.json()
        setItems(items)
        socket.emit('updateOverlay', { username: session?.user?.name, items })
      } else {
        throw new Error('Failed to add overlay item')
      }
    } catch (error) {
      console.error('Error adding overlay item:', error)
    }
  }

  const updateItem = async (id, newProps) => {
    try {
      const response = await fetch(`/api/overlay-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProps),
      })
      if (response.ok) {
        const { items } = await response.json()
        setItems(items)
        socket.emit('updateOverlay', { username: session?.user?.name, items })
      } else {
        throw new Error('Failed to update overlay item')
      }
    } catch (error) {
      console.error('Error updating overlay item:', error)
    }
  }

  const removeItem = async (id) => {
    try {
      const response = await fetch(`/api/overlay-items/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        const { items } = await response.json()
        setItems(items)
        setSelectedItem(null)
        socket.emit('updateOverlay', { username: session?.user?.name, items })
      } else {
        throw new Error('Failed to remove overlay item')
      }
    } catch (error) {
      console.error('Error removing overlay item:', error)
    }
  }

  const handleFileUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        addItem(file.type.startsWith('image/') ? 'image' : 'sound')
      } else {
        throw new Error('Failed to upload file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Overlay Editor</h2>
          <Button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            variant="outline"
          >
            {isPreviewMode ? (
              <>
                <Edit className="mr-2 h-4 w-4" /> Edit Mode
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" /> Preview Mode
              </>
            )}
          </Button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <Card className="w-full lg:w-3/4">
            <CardContent>
              {!isPreviewMode && (
                <div className="mb-4 flex flex-wrap gap-2">
                  <Button onClick={() => addItem('text')}><Plus className="mr-2 h-4 w-4" /> Add Text</Button>
                  <Button onClick={() => addItem('image')}><Plus className="mr-2 h-4 w-4" /> Add Image</Button>
                  <Button onClick={() => addItem('gif')}><Plus className="mr-2 h-4 w-4" /> Add GIF</Button>
                  <Button onClick={() => addItem('sound')}><Plus className="mr-2 h-4 w-4" /> Add Sound</Button>
                </div>
              )}
              {isPreviewMode ? (
                <PreviewMode items={items} />
              ) : (
                <OverlayGrid>
                  {items.map(item => (
                    <OverlayItem
                      key={item.id}
                      item={item}
                      updateItem={updateItem}
                      removeItem={removeItem}
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </OverlayGrid>
              )}
            </CardContent>
          </Card>
          {!isPreviewMode && (
            <Card className="w-full lg:w-1/4">
              <CardContent>
                <h3 className="text-lg font-semibold mb-4">Item Properties</h3>
                {selectedItem && (
                  <Tabs defaultValue="general">
                    <TabsList className="w-full">
                      <TabsTrigger value="general" className="w-1/2">General</TabsTrigger>
                      <TabsTrigger value="style" className="w-1/2">Style</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="content">Content</Label>
                          <Input
                            id="content"
                            value={selectedItem.content}
                            onChange={(e) => updateItem(selectedItem.id, { content: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="x-position">X Position</Label>
                          <Input
                            id="x-position"
                            type="number"
                            value={selectedItem.position.x}
                            onChange={(e) => updateItem(selectedItem.id, { position: { ...selectedItem.position, x: parseInt(e.target.value) } })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="y-position">Y Position</Label>
                          <Input
                            id="y-position"
                            type="number"
                            value={selectedItem.position.y}
                            onChange={(e) => updateItem(selectedItem.id, { position: { ...selectedItem.position, y: parseInt(e.target.value) } })}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="style">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="font-size">Font Size</Label>
                          <Input
                            id="font-size"
                            type="number"
                            value={selectedItem.style?.fontSize || 16}
                            onChange={(e) => updateItem(selectedItem.id, { style: { ...selectedItem.style, fontSize: parseInt(e.target.value) } })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="color">Color</Label>
                          <Input
                            id="color"
                            type="color"
                            value={selectedItem.style?.color || '#000000'}
                            onChange={(e) => updateItem(selectedItem.id, { style: { ...selectedItem.style, color: e.target.value } })}
                          />
                        </div>
                        {(selectedItem.type === 'image' || selectedItem.type === 'gif') && (
                          <div>
                            <Label htmlFor="size">Size</Label>
                            <Input
                              id="size"
                              type="number"
                              value={selectedItem.style?.size || 100}
                              onChange={(e) => updateItem(selectedItem.id, { style: { ...selectedItem.style, size: parseInt(e.target.value) } })}
                            />
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">File Upload</h3>
                  <FileUpload onUpload={handleFileUpload} accept="image/*,audio/*" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DndProvider>
  )
}

