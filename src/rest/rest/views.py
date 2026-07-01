from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from pymongo import MongoClient
from pymongo.errors import PyMongoError

import os

mongo_uri = f"mongodb://{os.environ['MONGO_HOST']}:{os.environ['MONGO_PORT']}"
db = MongoClient(mongo_uri)["test_db"]
todo_collection = db.todos


class TodoListView(APIView):
    def get(self, request):
        try:
            todos = []

            for todo in todo_collection.find():
                todos.append(
                    {
                        "_id": str(todo["_id"]),
                        "description": todo["description"],
                    }
                )

            return Response(todos, status=status.HTTP_200_OK)

        except PyMongoError:
            return Response(
                {"error": "Failed to retrieve TODOs."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        description = request.data.get("description", "").strip()

        if not description:
            return Response(
                {"error": "Description is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = todo_collection.insert_one(
                {
                    "description": description,
                }
            )

            return Response(
                {
                    "_id": str(result.inserted_id),
                    "description": description,
                },
                status=status.HTTP_201_CREATED,
            )

        except PyMongoError:
            return Response(
                {"error": "Failed to create TODO."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
