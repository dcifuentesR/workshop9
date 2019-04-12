package edu.eci.arsw.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import edu.eci.arsw.collabpaint.model.Point;

@Controller
public class STOMPMessagesHandler {
	
	@Autowired
	SimpMessagingTemplate msgt;
	
	@MessageMapping("/newpoint.{canvasID}")
	public void handlePointEvent(Point punto,@DestinationVariable String canvasID) {
		System.out.println("Nuevo punto recibido en el servidor!: "+punto);
		msgt.convertAndSend("/topic/newpoint."+canvasID, punto);
		
		
	}

}
