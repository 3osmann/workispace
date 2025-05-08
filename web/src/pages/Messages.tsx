
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Search, Send, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  id: string;
  from: string;
  email: string;
  avatar?: string;
  subject: string;
  message: string;
  date: Date;
  status: 'new' | 'read' | 'resolved';
}

const Messages = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'Sophie Martin',
      email: 'sophie.martin@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      subject: 'Problème de réservation',
      message: 'Bonjour, j\'ai essayé de réserver l\'appartement à Paris mais j\'ai rencontré un problème lors du paiement. Pouvez-vous m\'aider s\'il vous plaît?',
      date: new Date('2023-08-15T09:24:00'),
      status: 'new'
    },
    {
      id: '2',
      from: 'Thomas Bernard',
      email: 'thomas.bernard@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      subject: 'Question sur la disponibilité',
      message: 'Bonjour, je souhaite savoir si la villa à Nice est disponible pour la période du 10 au 20 juillet? Merci d\'avance pour votre réponse.',
      date: new Date('2023-08-14T14:35:00'),
      status: 'read'
    },
    {
      id: '3',
      from: 'Camille Dubois',
      email: 'camille.dubois@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
      subject: 'Annulation de réservation',
      message: 'Bonjour, je dois malheureusement annuler ma réservation pour l\'appartement à Lyon du 5 au 10 septembre pour des raisons personnelles. Est-ce possible d\'obtenir un remboursement? Merci pour votre compréhension.',
      date: new Date('2023-08-12T11:42:00'),
      status: 'resolved'
    },
    {
      id: '4',
      from: 'Alexandre Petit',
      email: 'alexandre.petit@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      subject: 'Wifi ne fonctionne pas',
      message: 'Bonjour, je suis actuellement dans votre appartement à Marseille et le wifi ne fonctionne pas. J\'ai essayé de redémarrer le routeur mais ça ne résout pas le problème. Pouvez-vous m\'aider?',
      date: new Date('2023-08-10T16:18:00'),
      status: 'new'
    }
  ]);

  const activeMessage = messages.find(msg => msg.id === activeMessageId);
  
  const filteredMessages = messages.filter(msg => 
    msg.from.toLowerCase().includes(searchQuery.toLowerCase()) || 
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReadMessage = (id: string) => {
    setActiveMessageId(id);
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === id && msg.status === 'new' ? { ...msg, status: 'read' } : msg
      )
    );
  };

  const handleResolveMessage = (id: string) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === id ? { ...msg, status: 'resolved' } : msg
      )
    );
    
    toast({
      title: "Message résolu",
      description: "Le message a été marqué comme résolu",
    });
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !activeMessageId) return;
    
    toast({
      title: "Réponse envoyée",
      description: "Votre réponse a été envoyée avec succès",
    });
    
    setReplyText('');
    handleResolveMessage(activeMessageId);
  };

  // Back to list function for mobile view
  const handleBackToList = () => {
    setActiveMessageId(null);
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1">
            Support client
          </p>
        </div>

        {isMobile && activeMessageId ? (
          // Mobile view with active message
          <div className="flex flex-col space-y-4">
            <Button 
              variant="outline" 
              className="w-fit" 
              onClick={handleBackToList}
              size="sm"
            >
              ← Retour
            </Button>
            
            <Card className="flex flex-col h-[calc(100vh-200px)]">
              <CardHeader className="px-4 py-3 border-b">
                <div>
                  <CardTitle className="text-lg">{activeMessage?.subject}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    De: {activeMessage?.from}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {activeMessage && new Date(activeMessage.date).toLocaleString()}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activeMessage?.avatar} />
                    <AvatarFallback>{activeMessage?.from.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 flex-1">
                    <p className="text-sm">{activeMessage?.message}</p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t p-3">
                <div className="flex flex-col w-full space-y-2">
                  <Textarea
                    placeholder="Répondre..."
                    className="resize-none"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={2}
                  />
                  <Button 
                    className="w-full"
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" /> Envoyer
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        ) : (
          // List view (mobile) or desktop layout
          <div className={isMobile ? "flex flex-col space-y-4" : "grid grid-cols-1 md:grid-cols-3 gap-4"}>
            {/* Message List */}
            <Card className={isMobile ? "flex flex-col h-[calc(100vh-180px)]" : "md:col-span-1 h-[calc(100vh-200px)] flex flex-col"}>
              <CardHeader className="space-y-2 px-3 py-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Messages</CardTitle>
                  <Badge variant="outline">
                    {messages.filter(m => m.status === 'new').length} nouveaux
                  </Badge>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    className="pl-8 h-8 text-sm" 
                    placeholder="Rechercher..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto px-2 pb-2 pt-0">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-8">
                    <TabsTrigger value="all" className="text-xs">Tous</TabsTrigger>
                    <TabsTrigger value="new" className="text-xs">Nouveaux</TabsTrigger>
                    <TabsTrigger value="resolved" className="text-xs">Résolus</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-2 space-y-2">
                    {filteredMessages.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Aucun message trouvé</p>
                      </div>
                    ) : (
                      filteredMessages.map((message) => (
                        <MessageItem 
                          key={message.id} 
                          message={message} 
                          isActive={message.id === activeMessageId}
                          onClick={() => handleReadMessage(message.id)} 
                        />
                      ))
                    )}
                  </TabsContent>
                  <TabsContent value="new" className="mt-2 space-y-2">
                    {filteredMessages.filter(m => m.status === 'new').length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Aucun nouveau message</p>
                      </div>
                    ) : (
                      filteredMessages.filter(m => m.status === 'new').map((message) => (
                        <MessageItem 
                          key={message.id} 
                          message={message} 
                          isActive={message.id === activeMessageId}
                          onClick={() => handleReadMessage(message.id)} 
                        />
                      ))
                    )}
                  </TabsContent>
                  <TabsContent value="resolved" className="mt-2 space-y-2">
                    {filteredMessages.filter(m => m.status === 'resolved').length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Aucun message résolu</p>
                      </div>
                    ) : (
                      filteredMessages.filter(m => m.status === 'resolved').map((message) => (
                        <MessageItem 
                          key={message.id} 
                          message={message} 
                          isActive={message.id === activeMessageId}
                          onClick={() => handleReadMessage(message.id)} 
                        />
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Message Content (desktop only) */}
            {!isMobile && (
              <Card className="md:col-span-2 h-[calc(100vh-200px)] flex flex-col">
                {activeMessage ? (
                  <>
                    <CardHeader className="px-4 py-3 border-b">
                      <div>
                        <CardTitle className="text-lg">{activeMessage.subject}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1 flex justify-between items-center">
                          <span>De: {activeMessage.from} ({activeMessage.email})</span>
                          {activeMessage.status !== 'resolved' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleResolveMessage(activeMessage.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Résoudre
                            </Button>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(activeMessage.date).toLocaleString()}
                        </p>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 overflow-y-auto p-4">
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage src={activeMessage.avatar} />
                          <AvatarFallback>{activeMessage.from.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 flex-1">
                          <p>{activeMessage.message}</p>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="border-t p-3">
                      <div className="flex items-center gap-3 w-full">
                        <Avatar className="hidden sm:block">
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 relative">
                          <Textarea
                            placeholder="Répondre à ce message..."
                            className="resize-none pr-12"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <Button 
                            size="sm" 
                            className="absolute right-3 bottom-3"
                            onClick={handleSendReply}
                            disabled={!replyText.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium">Aucun message sélectionné</h3>
                    <p className="text-muted-foreground mt-1">
                      Sélectionnez un message pour afficher son contenu
                    </p>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

interface MessageItemProps {
  message: Message;
  isActive: boolean;
  onClick: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isActive, onClick }) => {
  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary" className="text-xs px-1 py-0">Nouveau</Badge>;
      case 'resolved':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        "p-2 rounded-md hover:bg-muted cursor-pointer",
        isActive ? "bg-muted" : "",
        message.status === 'new' ? "border-l-2 border-primary" : ""
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="font-medium text-sm line-clamp-1">{message.subject}</div>
        <div className="flex items-center">{getStatusIcon(message.status)}</div>
      </div>
      <div className="flex items-center text-xs text-muted-foreground mb-1">
        <Mail className="h-3 w-3 mr-1" /> {message.from}
      </div>
      <p className="text-xs line-clamp-1 text-muted-foreground">{message.message}</p>
      <div className="text-xs text-muted-foreground mt-1">
        {new Date(message.date).toLocaleString('fr-FR', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  );
};

export default Messages;
