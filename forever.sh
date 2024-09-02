while true; do
	echo "Starting servier..." >> log.txt;
	npm start >> log.txt && break;
	echo "Server crashed, restarting...." >> log.txt;
	sleep 2;
done
