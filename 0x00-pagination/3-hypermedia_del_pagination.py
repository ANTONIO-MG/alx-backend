#!/usr/bin/env python3
"""
Deletion-resilient hypermedia pagination
"""

import csv
from typing import List, Dict


class Server:
    """
    Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """
        Load and cache the dataset from a CSV file.

        Returns:
            List[List]: The dataset loaded from the CSV file,
            excluding the header row.
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]
        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """
        Dataset indexed by sorting position, starting at 0.

        Returns:
            Dict[int, List]: The indexed dataset,
            truncated to the first 1000 rows.
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))}
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10):
        """
        Provide pagination metadata with resilience to dataset changes.

        Args:
            index (int): The start index for pagination.
            page_size (int): The number of items per page. Defaults to 10.

        Returns:
            Dict[str, any]: A dictionary containing the start index,
                            page size, data for the page, and the
                            next index to query.
        """
        assert index is not None, "Index cannot be None."
        dataset = self.indexed_dataset()
        data_size = len(dataset)

        assert 0 <= index < data_size, "Index out of range."

        data = []
        current_index = index
        while len(data) < page_size and current_index < data_size:
            if current_index in dataset:
                data.append(dataset[current_index])
            current_index += 1

        next_index = current_index if current_index < data_size else None

        return {
            "index": index,
            "data": data,
            "page_size": page_size,
            "next_index": next_index
        }
