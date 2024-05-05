<?php 
namespace OCA\EasyTalk\WebSocket;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class WebSocketServer implements MessageComponentInterface {
	protected $clients;

	public function __construct() {
        	$this->clients = new \SplObjectStorage;
	}

	public function onOpen(ConnectionInterface $conn) {
		// Logic when a new WebSocket connection is opened
		$this->clients->attach($conn);

		echo "New connection! ({$conn->resourceId})\n";
	}

	public function onClose(ConnectionInterface $conn) {
		// Logic when a WebSocket connection is closed
		$this->clients->detach($conn);

		echo "Connection {$conn->resourceId} has disconnected\n";
	}

	public function onError(ConnectionInterface $conn, \Exception $e) {
		// Logic to handle WebSocket errors
		
	}

	public function onMessage(ConnectionInterface $from, $msg) {
		// Logic to handle incoming WebSocket messages
		foreach ($this->clients as $client) {
			if ($client->resourceId == $from->resourceId) {
				continue;
			}
			// The sender is not the receiver, send to each client connected
			$client->send($msg);
		}
		file_put_contents('log.txt','[Websocket] '.date('d.m.Y H:i:s') . ': Client ' . $from->remoteAddress . ' sent ' . $msg . '\r\n', FILE_APPEND);
	}
}

