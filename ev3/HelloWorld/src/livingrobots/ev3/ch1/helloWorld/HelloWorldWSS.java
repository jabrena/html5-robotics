package livingrobots.ev3.ch1.helloWorld;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.util.Collection;

import lejos.hardware.motor.EV3LargeRegulatedMotor;
import lejos.hardware.port.MotorPort;
import lejos.robotics.RegulatedMotor;

import org.java_websocket.WebSocket;
import org.java_websocket.WebSocketImpl;
import org.java_websocket.framing.Framedata;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

public class HelloWorldWSS extends WebSocketServer {

	public HelloWorldWSS( int port ) throws UnknownHostException{
		super( new InetSocketAddress( port ) );
	}
	
	private static RegulatedMotor left;// = new EV3LargeRegulatedMotor(MotorPort.A);
	private static RegulatedMotor right;// = new EV3LargeRegulatedMotor(MotorPort.B);
	
	public static void main(String[] args) throws IOException, InterruptedException {
		// TODO Auto-generated method stub
		
		left = new EV3LargeRegulatedMotor(MotorPort.A);
		right = new EV3LargeRegulatedMotor(MotorPort.B);
		left.resetTachoCount();
		right.resetTachoCount();
		int speed = 900;
		int acceleration = 90000;
		
		left.setSpeed(speed);
		right.setSpeed(speed);

		left.setAcceleration(acceleration);
		right.setAcceleration(acceleration);
		
		WebSocketImpl.DEBUG = true;
		int port = 20000;
		HelloWorldWSS s = new HelloWorldWSS(port);
		s.start();
		System.out.println( "Websocket started on port: " + s.getPort() );

		//TODO I am not sure how to manage this kind of commands.
		BufferedReader sysin = new BufferedReader( new InputStreamReader( System.in ) );
		while ( true ) {
			String in = sysin.readLine();
			
			s.sendToAll( in );
			if( in.equals( "exit" ) ) {
				s.stop();
				break;
			} else if( in.equals( "restart" ) ) {
				s.stop();
				s.start();
				break;
			}
		}
	}

	@Override
	public void onOpen( WebSocket conn, ClientHandshake handshake ) {
		this.sendToAll( "new connection: " + handshake.getResourceDescriptor() );
		System.out.println( conn.getRemoteSocketAddress().getAddress().getHostAddress() + " connected with EV3!" );
	}

	@Override
	public void onClose( WebSocket conn, int code, String reason, boolean remote ) {
		this.sendToAll( conn + " EV3 Connection closed" );
		System.out.println( conn + " EV3 Connection closed" );
	}

	@Override
	public void onMessage( WebSocket conn, String message ) {

		if(message.equals("arriba")){
			System.out.println("arriba");
			left.rotate(90);
			right.rotate(90);
		}
		
		if(message.equals("abajo")){
			System.out.println("abajo");
			left.rotate(-90);
			right.rotate(-90);
		}
		
		if(message.equals("izquierda")){
			System.out.println("izquierda");
			left.rotate(90);
			right.rotate(0);
		}
		
		if(message.equals("derecha")){
			System.out.println("derecha");
			left.rotate(0);
			right.rotate(90);
		}
		
		this.sendToAll( message );
		System.out.println( conn + ": " + message );
	}

	@Override
	public void onFragment( WebSocket conn, Framedata fragment ) {
		System.out.println( "received fragment: " + fragment );
		//this.sendToAll(fragment);
	}
	
	@Override
	public void onError( WebSocket conn, Exception ex ) {
		ex.printStackTrace();
		if( conn != null ) {
			// some errors like port binding failed may not be assignable to a specific websocket
		}
	}
	
	/**
	 * Sends <var>text</var> to all currently connected WebSocket clients.
	 * 
	 * @param text
	 *            The String to send across the network.
	 * @throws InterruptedException
	 *             When socket related I/O errors occur.
	 */
	public void sendToAll( String text ) {
		Collection<WebSocket> con = connections();
		synchronized ( con ) {
			for( WebSocket c : con ) {
				c.send( text );
			}
		}
	}

	/*
	public void sendToAll( Framedata text ) {
		Collection<WebSocket> con = connections();
		synchronized ( con ) {
			for( WebSocket c : con ) {
				c.send( text );
			}
		}
	}
	*/
	
}
