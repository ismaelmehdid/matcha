import { AppLayout } from "@/components/layouts/AppLayout";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const socket: Socket = io("http://localhost:3000");

export function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ text: string; timestamp: Date }>
  >([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-row h-full gap-4">
        <Card className="w-1/4">
          <CardHeader>
            <CardTitle>Your Matches</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent>
            {/* TODO: Display all the users you can chat width here */}
          </CardContent>
        </Card>
        <Card className="w-3/4">
          <CardHeader>
            {/* TODO: Display the infos of the selected user here (Profile picture, first name, last name, age, location) */}
          </CardHeader>
          <CardContent>
            <div className="h-full border rounded p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <span className="text-sm text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString()}:
                  </span>
                  <span className="ml-2">{msg.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
