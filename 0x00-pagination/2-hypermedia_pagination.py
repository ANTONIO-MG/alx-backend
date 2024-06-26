#!/usr/bin/env python3
"""
Module that implements pagination for a dataset of popular baby names.
"""

import csv
import math
from typing import List, Tuple, Dict


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    Calculate start and end indexes for pagination.

    Args:
        page (int): The current page number (1-indexed).
        page_size (int): The number of items per page.

    Returns:
        Tuple[int, int]: A tuple containing the start index and the end index
                         corresponding to the range of indexes to return
                         in a list for those particular pagination parameters.
    """
    start_index = (page - 1) * page_size
    end_index = page * page_size
    return start_index, end_index


class Server:
    """
    Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """
        Load and cache the dataset from a CSV file.

        Returns:
            List[List]: The dataset loaded from the CSV file.
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]
        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        Get a page of the dataset.

        Args:
            page (int): The current page number (1-indexed). Defaults to 1.
            page_size (int): The number of items per page. Defaults to 10.

        Returns:
            List[List]: A list of rows from the dataset, page and page size.
        """
        assert isinstance(page, int) and page > 0
        assert isinstance(page_size, int) and page_size > 0

        start_index, end_index = index_range(page, page_size)

        if start_index >= len(self.dataset()):
            return []

        return self.dataset()[start_index:end_index]

    def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict[str, any]:
        """
        Get a dictionary representing a page of the dataset along with
        hypermedia metadata.

        Args:
            page (int): The current page number (1-indexed). Defaults to 1.
            page_size (int): The number of items per page. Defaults to 10.

        Returns:
            Dict[str, any]: A dictionary containing the page size,
                            current page number, data,
                            next page number, previous page number,
                            and total number of pages.
        """
        data_size = len(self.dataset())

        if page >= 2:
            prev_page = page - 1
        else:
            prev_page = None

        if (data_size / page_size) > page:
            next_page = page + 1
        else:
            next_page = None

        return {
            "page_size": len(self.get_page(page, page_size)),
            "page": page,
            "data": self.get_page(page, page_size),
            "next_page": next_page,
            "prev_page": prev_page,
            "total_pages": math.ceil(data_size / page_size),
        }
